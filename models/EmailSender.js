"use server";
import brevo from "@getbrevo/brevo";

import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
} from "@getbrevo/brevo";

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.NEXT_PUBLIC_BREVO_API_KEY
);

const PAGE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
const INSTAGRAM_URL = "https://www.instagram.com/asoporlospeluditosabandonados";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100067041306155";
const CONTACT_NUMBER = 85858505;
const CONTACT_EMAIL = "lorenajimenezg@hotmail.com";
const SENDER = {
  name: "Asociación Castrando Ando",
  email: "asociacioncastrandoando@gmail.com",
};

class EmailSender {
  static formatEmailTemplate(title, subtitle, content, additionalContent = "") {
    const emailTemplate = `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
 <meta charset="UTF-8" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <!--[if !mso]><!-- -->
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <!--<![endif]-->
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <meta name="format-detection" content="telephone=no" />
 <meta name="format-detection" content="date=no" />
 <meta name="format-detection" content="address=no" />
 <meta name="format-detection" content="email=no" />
 <meta name="x-apple-disable-message-reformatting" />
 <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:ital,wght@0,400;0,400;0,500;0,700;0,normal" rel="stylesheet" />
 <title>${title}</title>
 <!-- Made with Postcards Email Builder by Designmodo -->
 <!--[if !mso]><!-- -->
 <style>
 /* cyrillic-ext */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 400; src: local('Nunito Sans Regular'), local('NunitoSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmojLazX3dGTP.woff2) format('woff2'); unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }
         /* cyrillic */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 400; src: local('Nunito Sans Regular'), local('NunitoSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
         /* latin-ext */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 400; src: local('Nunito Sans Regular'), local('NunitoSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmYjLazX3dGTP.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
         /* latin */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 400; src: local('Nunito Sans Regular'), local('NunitoSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
                         /* cyrillic-ext */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 500; src: local('Nunito Sans Medium'), local('NunitoSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSxf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }
         /* cyrillic */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 500; src: local('Nunito Sans Medium'), local('NunitoSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
         /* latin-ext */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 500; src: local('Nunito Sans Medium'), local('NunitoSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSBf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
         /* latin */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 500; src: local('Nunito Sans Medium'), local('NunitoSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
                         /* cyrillic-ext */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 700; src: local('Nunito Sans Bold'), local('NunitoSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSxf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }
         /* cyrillic */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 700; src: local('Nunito Sans Bold'), local('NunitoSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
         /* latin-ext */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 700; src: local('Nunito Sans Bold'), local('NunitoSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSBf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
         /* latin */
         @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 700; src: local('Nunito Sans Bold'), local('NunitoSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
 </style>
 <!--<![endif]-->
 <style>
 html,
         body {
             margin: 0 !important;
             padding: 0 !important;
             min-height: 100% !important;
             width: 100% !important;
             -webkit-font-smoothing: antialiased;
             text-align: justify !important;
         }
 
         * {
             -ms-text-size-adjust: 100%;
             text-align: justify !important;
         }
 
         #outlook a {
             padding: 0;
         }
 
         .ReadMsgBody,
         .ExternalClass {
             width: 100%;
         }
 
         .ExternalClass,
         .ExternalClass p,
         .ExternalClass td,
         .ExternalClass div,
         .ExternalClass span,
         .ExternalClass font {
             line-height: 100%;
             text-align: justify !important;
         }
 
         table,
         td,
         th {
             mso-table-lspace: 0 !important;
             mso-table-rspace: 0 !important;
             border-collapse: collapse;
             text-align: justify !important;
         }
 
         u + .body table, u + .body td, u + .body th {
             will-change: transform;
         }
 
         body, td, th, p, div, li, a, span {
             -webkit-text-size-adjust: 100%;
             -ms-text-size-adjust: 100%;
             mso-line-height-rule: exactly;
             text-align: justify !important;
         }
 
         img {
             border: 0;
             outline: 0;
             line-height: 100%;
             text-decoration: none;
             -ms-interpolation-mode: bicubic;
         }
 
         a[x-apple-data-detectors] {
             color: inherit !important;
             text-decoration: none !important;
         }
                 
         .body .pc-project-body {
             background-color: transparent !important;
         }
 
         @media (min-width: 621px) {
             .pc-lg-hide {
                 display: none;
             } 
 
             .pc-lg-bg-img-hide {
                 background-image: none !important;
             }
         }
 </style>
 <style>
 @media (max-width: 820px) {
 .pc-project-body {min-width: 0px !important;}
 .pc-project-container {width: 100% !important;}
 .pc-sm-hide, .pc-w620-gridCollapsed-1 > tbody > tr > .pc-sm-hide {display: none !important;}
 .pc-sm-bg-img-hide {background-image: none !important;}
 .pc-w620-padding-25-35-0-35 {padding: 25px 35px 0px 35px !important;}
 .pc-w620-padding-5-0-15-0 {padding: 5px 0px 15px 0px !important;}
 .pc-w620-padding-15-35-0-35 {padding: 15px 35px 0px 35px !important;}
 .pc-w620-padding-10-35-10-35 {padding: 10px 35px 10px 35px !important;}
 .pc-w620-itemsSpacings-20-0 {padding-left: 10px !important;padding-right: 10px !important;padding-top: 0px !important;padding-bottom: 0px !important;}
 .pc-w620-padding-35-35-35-35 {padding: 35px 35px 35px 35px !important;}
 
 .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;margin-left: 0 !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
 
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
 
 .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 }
 @media (max-width: 720px) {
 .pc-w520-padding-25-30-0-30 {padding: 25px 30px 0px 30px !important;}
 .pc-w520-padding-5-0-15-0 {padding: 5px 0px 15px 0px !important;}
 .pc-w520-padding-15-30-0-30 {padding: 15px 30px 0px 30px !important;}
 .pc-w520-padding-10-30-10-30 {padding: 10px 30px 10px 30px !important;}
 .pc-w520-padding-30-30-30-30 {padding: 30px 30px 30px 30px !important;}
 }
 </style>
 <!--[if !mso]><!-- -->
 <style>
 @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/firasans/v17/va9E4kDNxMZdWfMOD5VvmYjN.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9E4kDNxMZdWfMOD5VvmYjL.woff2') format('woff2'); } @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnZKveSBf8.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnZKveSBf6.woff2') format('woff2'); } @font-face { font-family: 'Nunito Sans'; font-style: normal; font-weight: 700; src: url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnLK3eSBf8.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnLK3eSBf6.woff2') format('woff2'); }
 </style>
 <!--<![endif]-->
 <!--[if mso]>
    <style type="text/css">
        .pc-font-alt {
            font-family: Arial, Helvetica, sans-serif !important;
        }
    </style>
    <![endif]-->
 <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>

<body class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; line-height: 1.5; color: #2D3A41; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-variant-ligatures: normal; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; background-color: #ffffff; text-align: justify !important;" bgcolor="#ffffff">
 <table class="pc-project-body" style="table-layout: fixed; min-width: 600px; background-color: #ffffff;" bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
  <tr>
   <td align="center" valign="top">
    <table class="pc-project-container" align="center" width="600" style="width: 600px; max-width: 800px;" border="0" cellpadding="0" cellspacing="0" role="presentation">
     <tr>
      <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Title -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-25-30-0-30 pc-w620-padding-25-35-0-35" style="padding: 25px 40px 0px 40px; border-radius: 0px; background-color: #ffffff;" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="text-decoration: none;">
                    <div style="color:#515151;font-weight:700;font-style:normal;font-variant-ligatures:normal;">
                     <div style="margin-bottom: 0px;"><span style="font-family: 'Nunito Sans', Arial, Helvetica, sans-serif; font-size: 62px; line-height: 1.5; text-decoration: none; text-transform: none; text-align: justify !important;">${title}</span>
                     </div>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Title -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Image -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-5-0-15-0 pc-w620-padding-5-0-15-0" style="padding: 5px 0px 15px 0px; background-color: #ffffff;" bgcolor="#ffffff">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td valign="top" style="padding: 0px 0px 0px 30px;">
                   <img src="https://cloudfilesdm.com/postcards/image-1737047424258.jpg" width="300" height="auto" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 35%; height: auto; border: 0;" />
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Image -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Subtitle -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-15-30-0-30 pc-w620-padding-15-35-0-35" style="padding: 15px 40px 0px 40px; border-radius: 0px; background-color: #ffffff;" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="text-decoration: none;">
                    <div style="color:#434343;font-weight:500;font-style:normal;font-variant-ligatures:normal;">
                     <div style="margin-bottom: 0px;"><span style="font-family: 'Nunito Sans', Arial, Helvetica, sans-serif; font-size: 40px; line-height: 1.5; text-decoration: none; text-transform: none;">${subtitle}</span>
                     </div>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Subtitle -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Text -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-10-30-10-30 pc-w620-padding-10-35-10-35" style="padding: 10px 40px 10px 40px; border-radius: 0px; background-color: #ffffff;" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="text-decoration: none;">
                    <div style="text-align:left;text-align-last:left;color:#333333;font-style:normal;font-weight:normal;font-variant-ligatures:normal;">
                    ${content}
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Text -->
         </td>
        </tr>
        ${additionalContent}
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Footer 6 -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 40px 40px 40px; border-radius: 0px; background-color: #1b1b1b;" bgcolor="#1b1b1b">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" style="padding: 0px 0px 20px 0px;">
                   <table class="pc-width-hug pc-w620-gridCollapsed-0" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                     <td class="pc-grid-td-first pc-w620-itemsSpacings-20-0" valign="middle" style="padding-top: 0px; padding-right: 15px; padding-bottom: 0px; padding-left: 0px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <a class="pc-font-alt" href="${FACEBOOK_URL}" target="_blank" style="text-decoration: none;">
                                <img src="https://cloudfilesdm.com/postcards/e414faf5d7c4bea6ab1040f02772418a.png" class="" width="20" height="20" style="display: block; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 20px; height: 20px;" alt="" />
                               </a>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                     <td class="pc-grid-td-last pc-w620-itemsSpacings-20-0" valign="middle" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 15px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <a class="pc-font-alt" href="${INSTAGRAM_URL}" target="_blank" style="text-decoration: none;">
                                <img src="https://cloudfilesdm.com/postcards/ee4af7579ffc3dce51513f4dbea9247e.png" class="" width="20" height="20" style="display: block; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 20px; height: 20px;" alt="" />
                               </a>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" valign="top" style="padding: 0px 0px 14px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="center">
                      <div class="pc-font-alt" style="text-decoration: none;">
                       <div style="text-align:center;text-align-last:center;color:#d8d8d8;letter-spacing:-0.2px;font-weight:400;font-style:normal;font-variant-ligatures:normal;">
                        <div style="margin-bottom: 0px;"><span style="font-family: 'Nunito Sans', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 20px; text-decoration: none; text-transform: none;">Asociación Castrando Ando</span>
                        </div>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center">
                   <table class="pc-width-hug pc-w620-gridCollapsed-0" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                     <td class="pc-grid-td-first pc-grid-td-last" valign="top" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="top">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="border-collapse: separate; border-spacing: 0;">
                             <tr>
                              <td valign="top" align="left">
                               <a class="pc-font-alt" href="${PAGE_URL}" target="_blank" style="text-decoration: none;">
                                <span style="color:#1595e7;letter-spacing:-0.2px;font-weight:500;font-style:normal;display:inline-block;font-variant-ligatures:normal;"><span style="margin-bottom: 0px;"><span style="font-family: 'Nunito Sans', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 171%; text-decoration: none; text-transform: none;">Visitar página</span>
                                </span>
                                </span>
                               </a>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Footer 6 -->
         </td>
        </tr>
        
       </table>
      </td>
     </tr>
    </table>
   </td>
  </tr>
 </table>
</body>

</html>
`;
    return emailTemplate;
  }

  static formatBodyContent(content) {
    return `
    <div style="margin-bottom: 15px;">
    <span style="font-family: 'Nunito Sans', Arial, Helvetica, sans-serif; font-size: 20px; line-height: 1.5; text-decoration: none; text-transform: none; text-align: justify;">${content}</span>
    </div>
    `;
  }

  static async sendContactEmail(msg, email, name, type) {
    const smtpEmail = new SendSmtpEmail();
    try {
      smtpEmail.subject = `¡${name} los quiere contactar!`;
      smtpEmail.to = [
        {
          email: "asociacioncastrandoando@gmail.com",
          name: "Asociación Castrando Ando",
        },
      ];
      const title = `Contacto`;
      const subtitle = `¡${name} los quiere contactar!`;
      const content = `
      ${EmailSender.formatBodyContent(
        `${name} dejó una ${type} con este mensaje: ${msg}`
      )}
      ${EmailSender.formatBodyContent(
        `Utilice el correo ${email} para comunicarte con ${name}. Puede utilizar la funcionalidad en la página web de administradores.`
      )}
      `;
      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content
      );
      smtpEmail.sender = {
        name: name,
        email: "asociacioncastrandoando@gmail.com",
      };
      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false };
    }
  }

  static async sendAfterSurgeryEmail(email, name) {
    const smtpEmail = new SendSmtpEmail();
    try {
      smtpEmail.subject = "Cuidados después de la cirugía de castración";
      smtpEmail.to = [
        {
          email: email,
          name: name,
        },
      ];

      const title = "Ciudados";
      const subtitle = `${name},`;
      const content = `
      ${EmailSender.formatBodyContent(
        `Muchas gracias por haber asistido a la campaña de castración. Le recordamos las siguientes medidas de ciudado para después de la cirugía de castración.
        
        <ol>
        <li>
          Colocar al animal en el suelo, en lugar cerrado, tranquilo y caliente
          para que salga completamente del efecto de la anestesia.
        </li>
        <li>
          Cuando despierte <strong>TOTALMENTE</strong> se puede ofrecer un poco
          de agua y comida en dosis pequeñas.
        </li>
        <li>
          Si el animal vomitara en las primeras horas después de la cirugía, es
          <strong>NORMAL</strong>. Si el vómito persiste después de las primeras
          36 horas <strong>LLAMAR AL NÚMERO BRINDADO</strong> (ver abajo).
        </li>
        <li>
          Administrar los medicamentos indicados con el estómago lleno para
          evitar alteraciones gástricas.
        </li>
        <li>
          La herida se debe limpiar a <strong>DIARIO</strong> con agua y jabón y
          secarla muy bien. Es recomendable aplicar algún cicatrizante en crema
          o spray 2-3 veces al día por 12 días. (la Violetta <strong>NO</strong>
          es aconsejable)
        </li>
        <li>
          Los puntos externos se caen solos al mes de la cirugía. Si se decide
          quitarlos antes, se puede realizar a partir del día doce después de
          la cirugía.
        </li>
        <li>
          Por ningún motivo se debe de dejar que el paciente se lama la herida.
          Esto es <strong>TOTALMENTE PROHIBIDO</strong>. Se aconseja ponerles un
          collar isabelino.
        </li>
        <li>
          Se considera <strong>NORMAL</strong> si a las hembras se les hace un
          abultamiento en la herida o al lado de la herida. A los machos es
          <strong>NORMAL</strong> que se les inflame un poco y que el escroto
          tome una coloración azulada.
        </li>
      </ol>
      
      <strong>Dra. Carol Miranda. Tel: 2237-1312.</strong>`
      )}
      `;

      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content
      );
      smtpEmail.sender = SENDER;
      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false };
    }
  }

  static async sendConfirmationEmail(
    email,
    name,
    hour,
    date,
    campaign,
    campaignId,
    inscriptionId
  ) {
    const smtpEmail = new SendSmtpEmail();
    const dateFormat = new Intl.DateTimeFormat("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    date = dateFormat.format(new Date(date + "T12:00:00Z"));

    // Create QR code content with appointment details
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    // Generate QR with QR Server
    const adminUrl = `${baseUrl}/admin/campaign/inscritos?id=${campaignId}&timeslot=${encodeURIComponent(
      hour
    )}&inscriptionId=${inscriptionId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      adminUrl
    )}`;

    try {
      smtpEmail.subject = `¡${name}, su cita ha sido agendada!`;
      smtpEmail.to = [
        {
          email: email,
          name: name,
        },
      ];

      const title = "Confirmación de cita";
      const subtitle = `¡${name}, su cita ha sido agendada!`;
      const content = `
      ${EmailSender.formatBodyContent(
        `¡Hola, ${name}! Su cita para la campaña ${campaign} para la fecha ${date} a la hora ${hour} fue reservada con éxito.`
      )}
      ${EmailSender.formatBodyContent(
        `Recuerde estar al menos 10 minutos antes de la cita y cumplir con los requisitos. Cualquier consulta adicional al correo: ${CONTACT_EMAIL} o al número: ${CONTACT_NUMBER}.`
      )}
      `;
      const additionalContent = `
        <tr>
         <td valign="top">
            <!-- Add QR Code -->
            <div style="margin-top: 20px; text-align: center; background-color: #ffffff;">
              <span style="font-family: 'Nunito Sans', Arial, Helvetica, sans-serif; font-size: 20px; line-height: 1.5; text-decoration: none; text-transform: none;">Muestre este código QR para que los voluntarios lo reciban:</span>
            </div>
            <img src="${qrCodeUrl}" alt="QR Code" style="width: 150px; height: 150px; margin: 30px 0;"/>
          </td>
        </tr>
      `;
      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content,
        additionalContent
      );
      //se puede usar este para hacer cosas mas personalizadas
      smtpEmail.sender = SENDER;
      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false };
    }
  }

  static async sendCancelEmail(email, name, hour, date, campaign) {
    console.log(email, name, hour, date, campaign);
    const smtpEmail = new SendSmtpEmail();
    const dateFormat = new Intl.DateTimeFormat("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    date = dateFormat.format(new Date(date + "T12:00:00Z"));
    try {
      smtpEmail.subject = name + " tu cita ha sido cancelada!";
      smtpEmail.to = [
        {
          email: email,
          name: name,
        },
      ];
      const title = "Cancelación de cita";
      const subtitle = `¡${name}, su cita ha sido cancelada!`;
      const content = `
      ${EmailSender.formatBodyContent(
        `¡Hola, ${name}! Su cita para la campaña ${campaign} para la fecha ${date} a la hora ${hour} fue cancelada con éxito.`
      )}
      ${EmailSender.formatBodyContent(
        `Es una lástima que hayas tenido que cancelar la cita, en la Asociación Castrando Ando te esperamos con los brazos abiertos para nuestras próximas campañas. Cualquier consulta adicional al correo: ${CONTACT_EMAIL} o al número: ${CONTACT_NUMBER}.`
      )}
      `;
      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content
      );

      smtpEmail.sender = SENDER;

      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false };
    }
  }

  static async sendReminder(email, name, hour, date, campaign) {
    const smtpEmail = new SendSmtpEmail();
    const dateFormat = new Intl.DateTimeFormat("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    date = dateFormat.format(new Date(date + "T12:00:00Z"));
    try {
      smtpEmail.subject = name + " recordatorio de tu cita";
      smtpEmail.to = [
        {
          email: email,
          name: name,
        },
      ];

      const title = "Recordatorio";
      const subtitle = `¡${name}, le recordamos su cita!`;
      const content = `
      ${EmailSender.formatBodyContent(
        `¡Hola, ${name}! Tienes una cita para la campaña ${campaign} para la fecha ${date} a la hora ${hour}.</span> </div> <div><span>&#xFEFF;</span> </div> <div><span style="font-weight: normal;font-style: normal;color: rgb(131, 148, 150);">Recuerda ser puntual y seguir las recomendaciones establecidas para la campaña. Cualquier consulta adicional al correo: ${CONTACT_EMAIL} o al número: ${CONTACT_NUMBER}.`
      )}
      `;

      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content
      );
      smtpEmail.sender = SENDER;
      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  static async sendReply(msg, mail, name, adminReply) {
    const smtpEmail = new SendSmtpEmail();
    try {
      smtpEmail.subject = "Respuesta a tu mensaje - Castrando Ando";
      smtpEmail.to = [
        {
          email: mail,
          name: name,
        },
      ];

      const title = "Respuesta a su mensaje";
      const subtitle = `Hola ${name},`;
      const content = EmailSender.formatBodyContent(`
      Hemos recibido su mensaje:
      "${msg}"
      
      Nuestra respuesta es:
      ${adminReply}
      
      --
      Saludos,
      Asociación Castrando Ando`);
      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content
      );

      smtpEmail.sender = SENDER;

      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  static async sendNewsletterEmail(content, email, subject) {
    const smtpEmail = new SendSmtpEmail();
    try {
      smtpEmail.subject = subject;
      smtpEmail.to = [
        {
          email: email,
          name: email.split("@")[0], // Use part before @ as name
        },
      ];
      const title = "Boletín informativo";
      const subtitle = "¡Hola!";
      const mailContent = EmailSender.formatBodyContent(content);
      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        mailContent
      );
      smtpEmail.sender = SENDER;

      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      console.error("Error sending newsletter email:", error);
      return { ok: false };
    }
  }

  static async sendActivityRegistrationEmail(email, name, activity) {
    const smtpEmail = new SendSmtpEmail();
    const dateFormat = new Intl.DateTimeFormat("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const date = dateFormat.format(new Date(activity.date + "T12:00:00Z"));

    try {
      smtpEmail.subject = `¡${name}, su inscripción a la actividad ${activity.title} ha sido registrada!`;
      smtpEmail.to = [
        {
          email: email,
          name: name,
        },
      ];

      const title = "Registro a actividad";
      const subtitle = `¡${name}, su inscripción a la actividad ${activity.title} ha sido registrada!`;
      const content = `
      ${EmailSender.formatBodyContent(
        `¡Hola, ${name}! Su inscripción a la actividad ${activity.title} para la fecha ${date} a la hora ${activity.hour} fue registrada con éxito.`
      )}
      ${EmailSender.formatBodyContent(
        `Le deseamos un excelente día en la actividad en ${activity.location}.`
      )}
      ${EmailSender.formatBodyContent(
        `Recuerde cumplir con los requisitos para esta actividad: ${activity.requirements}`
      )}
      `;

      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content
      );
      smtpEmail.sender = SENDER;
      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false };
    }
  }

  static async sendActivityDeregistrationEmail(email, name, activity) {
    const smtpEmail = new SendSmtpEmail();
    const dateFormat = new Intl.DateTimeFormat("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const date = dateFormat.format(new Date(activity.date + "T12:00:00Z"));

    try {
      smtpEmail.subject = `¡${name}, su inscripción a la actividad ${activity.title} ha sido cancelada!`;
      smtpEmail.to = [
        {
          email: email,
          name: name,
        },
      ];

      const title = "Desinscripción a actividad";
      const subtitle = `¡${name}, su inscripción a la actividad ${activity.title} ha sido cancelada!`;
      const content = `
      ${EmailSender.formatBodyContent(
        `¡Hola, ${name}! Su inscripción a la actividad ${activity.title} para la fecha ${date} a la hora ${activity.hour} fue cancelada con éxito.`
      )}
      `;

      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content
      );
      smtpEmail.sender = SENDER;
      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false };
    }
  }

  static async sendCertificateEmail(email, name, certificateBuffer) {
    const smtpEmail = new SendSmtpEmail();
    try {
      smtpEmail.subject = "Certificado de Voluntariado - Castrando Ando";
      smtpEmail.to = [
        {
          email: email,
          name: name,
        },
      ];

      const title = "Certificado de Voluntariado";
      const subtitle = `¡Gracias por tu voluntariado, ${name}!`;
      const content = EmailSender.formatBodyContent(`
        Adjunto encontrarás tu certificado de voluntariado. 
        Agradecemos tu dedicación y compromiso con nuestra causa.
      `);

      smtpEmail.htmlContent = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content
      );

      // Convert buffer to base64 string properly
      const base64Certificate = certificateBuffer.toString("base64");

      // Get formatted date for filename
      const dateForFilename = new Date()
        .toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");

      smtpEmail.attachment = [
        {
          content: base64Certificate,
          name: `Certificado-${name.replace(
            /\s+/g,
            "-"
          )}-${dateForFilename}.jpg`,
          type: "image/jpeg",
        },
      ];

      smtpEmail.sender = SENDER;

      const result = await apiInstance.sendTransacEmail(smtpEmail);
      return { ok: true };
    } catch (error) {
      console.error("Error sending certificate email:", error);
      return { ok: false };
    }
  }
}

export default EmailSender;
