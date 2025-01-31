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

  test("getAllOnce should handle empty data", async () => {
    get.mockImplementationOnce(() => ({
      exists: () => false,
      val: () => null,
    }));

    const result = await Raffle.getAllOnce();
    expect(result).toEqual([]);
  });
});
