const Ally = require("@/models/Ally").default;
const { ref, get, set, update, remove } = require("firebase/database");

jest.mock("firebase/database");
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("Ally Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAll should fetch all allies", async () => {
    const mockAllies = { ally1: { name: "Ally 1" }, ally2: { name: "Ally 2" } };
    get.mockImplementationOnce(() => ({
      exists: () => true,
      val: () => mockAllies,
    }));

    const result = await Ally.getAll();
    expect(ref).toHaveBeenCalledWith({}, "allies");
    expect(result).toEqual(mockAllies);
  });

  test("getById should fetch a specific ally", async () => {
    const mockAlly = { name: "Ally 1" };
    get.mockImplementationOnce(() => ({
      exists: () => true,
      val: () => mockAlly,
    }));

    const result = await Ally.getById("ally1");
    expect(ref).toHaveBeenCalledWith({}, "allies/ally1");
    expect(result).toEqual(mockAlly);
  });

  test("createAlly should create a new ally", async () => {
    const allyData = { id: "ally1", name: "New Ally" };
    await Ally.createAlly(allyData);
    expect(set).toHaveBeenCalled();
  });
});
