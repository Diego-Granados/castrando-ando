class CommentSection {
  constructor(options) {
    this.options = {
      container: null,          // Elemento DOM donde se renderizarán los comentarios
      entityType: '',          // Tipo de entidad (blog, forum, etc)
      entityId: '',            // ID de la entidad
      allowReplies: true,      // Si se permiten respuestas
      maxDepth: 2,             // Profundidad máxima de respuestas
      onUserCheck: () => CommentController.isUserAuthenticated(),
      getCurrentUser: () => CommentController.getCurrentUser(),
      isAdmin: false // Nueva opción para verificar si es admin
    };

    // Combinar opciones por defecto con las proporcionadas
    Object.assign(this.options, options);

    this.comments = [];
    this.replyTo = null;

    // Inicializar
    this.init();
  }

  async init() {
    // Crear estructura básica
    this.createStructure();
    // Cargar comentarios
    await this.loadComments();
    // Agregar event listeners
    this.addEventListeners();
  }

  createStructure() {
    const container = this.options.container;
    container.innerHTML = `
      <div class="comments-section">
        <h3>Comentarios</h3>
        <div class="comment-form-container">
          ${this.createCommentFormHTML()}
        </div>
        <div class="comments-list"></div>
      </div>
    `;

    // Agregar estilos
    this.addStyles();
  }

  createCommentFormHTML() {
    if (!this.options.onUserCheck()) {
      return '<p>Debes iniciar sesión para comentar</p>';
    }

    return `
      <form class="comment-form">
        <div class="reply-to-container" style="display: none;">
          <small>Respondiendo a: <span class="reply-to-name"></span></small>
          <button type="button" class="cancel-reply">Cancelar</button>
        </div>
        <textarea 
          placeholder="Escribe un comentario..." 
          class="comment-input"
          rows="3"
        ></textarea>
        <button type="submit" class="submit-comment">Publicar comentario</button>
      </form>
    `;
  }

  addStyles() {
    const styles = `
      ${this.options.styles || ''}
      .comments-section {
        margin-top: 2rem;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .author-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .author-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
      }
      .admin-badge {
        background-color: #2055A5;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.75rem;
        margin-left: 0.5rem;
      }
      .edited-mark {
        color: #666;
        font-style: italic;
      }
      .comment-form {
        margin-bottom: 1.5rem;
      }
      .comment-input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .comment-item {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        margin-bottom: 1rem;
      }
      .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .comment-actions {
        margin-top: 0.5rem;
      }
      .comment-actions button {
        margin-right: 0.5rem;
        padding: 0.25rem 0.5rem;
        background: none;
        border: none;
        color: #0066cc;
        cursor: pointer;
      }
      .comment-actions button:hover {
        text-decoration: underline;
      }
      .nested-comment {
        margin-left: 2rem;
        border-left: 2px solid #eee;
        padding-left: 1rem;
      }
      .submit-comment {
        padding: 0.5rem 1rem;
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .submit-comment:hover {
        background-color: #0052a3;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  async loadComments() {
    try {
      this.comments = await Comment.getAll(this.options.entityType, this.options.entityId);
      this.renderComments();
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    }
  }

  renderComments() {
    const commentsContainer = this.options.container.querySelector('.comments-list');
    commentsContainer.innerHTML = '';

    this.comments.forEach(comment => {
      commentsContainer.appendChild(this.createCommentElement(comment));
    });
  }

  createCommentElement(comment, depth = 0) {
    const div = document.createElement('div');
    div.className = `comment-item ${depth > 0 ? 'nested-comment' : ''}`;
    
    const currentUser = this.options.getCurrentUser();
    const canModify = currentUser && (
      comment.authorId === currentUser.uid || 
      this.options.isAdmin // Los admins pueden modificar cualquier comentario
    );

    const authorBadge = comment.authorRole === 'Admin' 
      ? '<span class="admin-badge">Admin</span>' 
      : '';

    div.innerHTML = `
      <div class="comment-header">
        <div class="author-info">
          ${comment.authorAvatar ? 
            `<img src="${comment.authorAvatar}" alt="${comment.author}" class="author-avatar"/>` 
            : ''
          }
          <strong>${comment.author}</strong>
          ${authorBadge}
        </div>
        <small>${new Date(comment.createdAt).toLocaleDateString()}</small>
      </div>
      <div class="comment-content">
        <p>${comment.content}</p>
        ${comment.isEdited ? '<small class="edited-mark">(editado)</small>' : ''}
      </div>
      <div class="comment-actions">
        ${this.options.allowReplies && depth < this.options.maxDepth ? 
          `<button class="reply-button" data-comment-id="${comment.id}">Responder</button>` : 
          ''
        }
        ${canModify ? `
          <button class="edit-button" data-comment-id="${comment.id}">Editar</button>
          <button class="delete-button" data-comment-id="${comment.id}">Eliminar</button>
        ` : ''}
      </div>
    `;

    return div;
  }

  addEventListeners() {
    const container = this.options.container;
    
    // Manejar envío de nuevo comentario
    const form = container.querySelector('.comment-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmitComment(e);
      });
    }

    // Delegación de eventos para botones de acción
    container.addEventListener('click', async (e) => {
      if (e.target.matches('.reply-button')) {
        this.handleReply(e.target.dataset.commentId);
      } else if (e.target.matches('.edit-button')) {
        this.handleEdit(e.target.dataset.commentId);
      } else if (e.target.matches('.delete-button')) {
        await this.handleDelete(e.target.dataset.commentId);
      } else if (e.target.matches('.cancel-reply')) {
        this.cancelReply();
      }
    });
  }

  // ... Implementar métodos de manejo de eventos ...
  async handleSubmitComment(e) {
    const textarea = e.target.querySelector('.comment-input');
    const content = textarea.value.trim();
    
    if (!content) return;

    try {
      const result = await CommentController.createComment({
        entityType: this.options.entityType,
        entityId: this.options.entityId,
        content,
        parentId: this.replyTo?.id
      });

      if (result.ok) {
        textarea.value = '';
        this.cancelReply();
        await this.loadComments();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error al publicar comentario:', error);
    }
  }
}
