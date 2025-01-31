import Raffle from "@/models/Raffle";
import { ref, get, set, update, remove, onValue } from "firebase/database";

jest.mock("firebase/database");
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("Raffle Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("create should initialize raffle with 100 numbers", async () => {
    const raffleData = { name: "Test Raffle", price: 1000 };
    await Raffle.create(raffleData);

    // Verify set was called with correct data structure
    expect(set).toHaveBeenCalled();
    const setCall = set.mock.calls[0][1];
    expect(setCall.name).toBe(raffleData.name);
    expect(setCall.price).toBe(raffleData.price);
    expect(Object.keys(setCall.numbers).length).toBe(100);
  });

  test("updateNumber should update raffle number data", async () => {
    const numberData = {
      buyer: "John Doe",
      id: "123456",
      phone: "1234567890",
      status: "pending",
    };

    await Raffle.updateNumber("raffle1", "5", numberData);
    expect(update).toHaveBeenCalled();
    const updateCall = update.mock.calls[0][1];
    expect(updateCall.buyer).toBe(numberData.buyer);
    expect(updateCall.status).toBe(numberData.status);
  });

  test("getAllOnce should handle empty data", async () => {
    get.mockImplementationOnce(() => ({
      exists: () => false,
      val: () => null,
    }));

    const result = await Raffle.getAllOnce();
    expect(result).toEqual({});
  });

  test("subscribeToRaffle should set up listener correctly", () => {
    const setRaffle = jest.fn();
    Raffle.subscribeToRaffle("raffle1", setRaffle);
    expect(onValue).toHaveBeenCalled();
  });
});
