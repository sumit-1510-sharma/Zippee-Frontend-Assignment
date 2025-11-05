// Simple mocked auth service that returns a fake JWT and refresh token.

function base64Encode(obj) {
  return btoa(JSON.stringify(obj));
}

function makeFakeJwt(payloadObj) {
  // Creates a fake JWT with supplied payload.
  const header = { alg: "HS256", typ: "JWT" };
  const signature = "fake-signature";
  return `${base64Encode(header)}.${base64Encode(payloadObj)}.${signature}`;
}

export const mockAuthService = {
  // Validates credentials and returns tokens.
  login: async ({ username, password }) => {
    await new Promise((r) => setTimeout(r, 400));
    if (username === "demo" && password === "password") {
      const now = Math.floor(Date.now() / 1000);
      const accessExp = now + 300;
      const refreshExp = now + 500;

      const accessToken = makeFakeJwt({
        sub: "demo-user-id",
        name: "Demo User",
        iat: now,
        exp: accessExp,
        scope: "read",
      });

      const refreshToken = makeFakeJwt({
        sub: "demo-user-id",
        iat: now,
        exp: refreshExp,
        token_type: "refresh",
      });

      return {
        accessToken,
        refreshToken,
        expiresAt: accessExp,
      };
    }
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  },

  // Returns new access token if refresh is valid, else throws.
  refresh: async ({ refreshToken }) => {
    await new Promise((r) => setTimeout(r, 350));
    try {
      const payloadB64 = refreshToken.split(".")[1];
      const payload = JSON.parse(atob(payloadB64));
      const now = Math.floor(Date.now() / 1000);
      if (!payload.exp || payload.exp < now) {
        const err = new Error("Refresh token expired");
        err.status = 401;
        throw err;
      }
      const accessExp = now + 60;
      const accessToken = makeFakeJwt({
        sub: payload.sub || "demo-user-id",
        name: "Demo User",
        iat: now,
        exp: accessExp,
        scope: "read",
      });
      return { accessToken, expiresAt: accessExp };
    } catch {
      const err = new Error("Invalid refresh token");
      err.status = 401;
      throw err;
    }
  },
};
