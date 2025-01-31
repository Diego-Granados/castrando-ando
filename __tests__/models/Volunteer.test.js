import VolunteerModel from "@/models/Volunteer";
import { ref, get, set, update, remove } from "firebase/database";

jest.mock("firebase/database");
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("Volunteer Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    test("should create a new volunteer successfully", async () => {
      const volunteerData = {
        id: "123456789",
        name: "John Doe",
        email: "john@example.com",
      };

      // Mock that volunteer doesn't exist yet
      get.mockImplementationOnce(() => ({
        exists: () => false,
      }));

      const result = await VolunteerModel.create(volunteerData);

      expect(ref).toHaveBeenCalledWith({}, "volunteers/123456789");
      expect(set).toHaveBeenCalled();
      expect(result).toEqual({
        ...volunteerData,
        status: "pending",
      });
    });

    test("should throw error if volunteer already exists", async () => {
      const volunteerData = {
        id: "123456789",
        name: "John Doe",
      };

      // Mock that volunteer already exists
      get.mockImplementationOnce(() => ({
        exists: () => true,
      }));

      await expect(VolunteerModel.create(volunteerData)).rejects.toThrow(
        "Ya existe una solicitud con este número de cédula"
      );
    });
  });

  describe("getById", () => {
    test("should return volunteer when found", async () => {
      const mockVolunteer = {
        name: "John Doe",
        email: "john@example.com",
        status: "sent",
      };

      get.mockImplementationOnce(() => ({
        exists: () => true,
        val: () => mockVolunteer,
      }));

      const result = await VolunteerModel.getById("123456789");
      expect(ref).toHaveBeenCalledWith({}, "volunteers/123456789");
      expect(result).toEqual(mockVolunteer);
    });

    test("should throw error when volunteer not found", async () => {
      get.mockImplementationOnce(() => ({
        exists: () => false,
      }));

      await expect(VolunteerModel.getById("123456789")).rejects.toThrow(
        "No se ha encontrado ninguna solicitud con esta cédula"
      );
    });
  });

  describe("getAll", () => {
    test("should return all volunteers", async () => {
      const mockVolunteers = [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Doe" },
      ];

      get.mockImplementationOnce(() => ({
        exists: () => true,
        forEach: (callback) => {
          mockVolunteers.forEach((volunteer) => {
            callback({
              key: volunteer.id,
              val: () => ({ name: volunteer.name }),
            });
          });
        },
      }));

      const result = await VolunteerModel.getAll();
      expect(ref).toHaveBeenCalledWith({}, "volunteers");
      expect(result).toEqual(mockVolunteers);
    });

    test("should return empty array when no volunteers exist", async () => {
      get.mockImplementationOnce(() => ({
        exists: () => false,
      }));

      const result = await VolunteerModel.getAll();
      expect(result).toEqual([]);
    });
  });

  describe("delete", () => {
    test("should delete volunteer successfully", async () => {
      const volunteerId = "123456789";

      await VolunteerModel.delete(volunteerId);

      expect(ref).toHaveBeenCalledWith({}, `volunteers/${volunteerId}`);
      expect(remove).toHaveBeenCalled();
    });
  });
});
