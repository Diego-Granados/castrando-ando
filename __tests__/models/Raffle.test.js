import { ref, get, set, update, onValue, remove } from "firebase/database";
import { db } from "@/lib/firebase/config";
import Raffle from "@/models/Raffle";

// Mock Firebase
jest.mock("firebase/database", () => ({
  ref: jest.fn(() => "mockedRef"),
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(() => Promise.resolve()),
  onValue: jest.fn((ref, callback) => {
    callback({
      exists: () => true,
      val: () => ({ name: "Test Raffle" }),
    });
    return () => {};
  }),
  remove: jest.fn(),
  getDatabase: jest.fn(),
}));

jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("Raffle Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updateNumber should update raffle number data", async () => {
    const raffleId = "test-raffle";
    const number = "42";
    const numberData = {
      buyer: "Test Buyer",
      status: "pending",
      approved: false,
      id: "",
      number: 42,
      phone: "",
      purchased: false,
      receipt: "",
    };

    const result = await Raffle.updateNumber(raffleId, number, numberData);

    expect(ref).toHaveBeenCalledWith(
      db,
      `raffles/${raffleId}/numbers/${number}`
    );
    expect(update).toHaveBeenCalledWith("mockedRef", numberData);
    expect(result).toBe(true);
  });

  test("subscribeToRaffle should set up listener correctly", () => {
    const raffleId = "test-raffle";
    const setRaffle = jest.fn();

    Raffle.subscribeToRaffle(raffleId, setRaffle);

    expect(ref).toHaveBeenCalledWith(db, `raffles/${raffleId}`);
    expect(onValue).toHaveBeenCalled();
    expect(setRaffle).toHaveBeenCalledWith({
      id: raffleId,
      name: "Test Raffle",
    });
  });

  test("getAllOnce should handle empty data", async () => {
    get.mockResolvedValueOnce({
      exists: () => false,
      val: () => null,
    });

    const result = await Raffle.getAllOnce();
    expect(result).toEqual([]);
  });
});
