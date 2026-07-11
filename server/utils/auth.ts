import { SignJWT, jwtVerify } from 'jose'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

let cachedSecret: ReturnType<typeof TextEncoder.prototype.encode> | null = null

const getSecret = () => {
  if (!cachedSecret) {
    const config = useRuntimeConfig()
    cachedSecret = new TextEncoder().encode(config.jwtSecret)
  }
  return cachedSecret
}

export const signToken = async (payload: TokenPayload): Promise<string> => {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret())
}

export const verifyToken = async (token: string): Promise<TokenPayload> => {
  const { payload } = await jwtVerify(token, getSecret())
  return payload as unknown as TokenPayload
}
