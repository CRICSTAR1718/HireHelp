import { getHealthResponse } from "./health.service";
import { SERVICE_NAME, SERVICE_VERSION } from "../../../config/constants";

describe("Health", () => {
  it("getHealthResponse returns expected payload", () => {
    const payload = getHealthResponse();

    expect(payload).toEqual(
      expect.objectContaining({
        success: true,
        message: "Super Admin Service running",
        service: SERVICE_NAME,
        version: SERVICE_VERSION,
        timestamp: expect.any(String)
      })
    );
  });
});


