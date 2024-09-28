-- CreateTable
CREATE TABLE "kstudio_users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "wechatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kstudio_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kstudio_refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kstudio_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kstudio_password_resets" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kstudio_password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kstudio_users_username_key" ON "kstudio_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "kstudio_users_email_key" ON "kstudio_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "kstudio_users_phone_key" ON "kstudio_users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "kstudio_users_wechatId_key" ON "kstudio_users"("wechatId");

-- CreateIndex
CREATE UNIQUE INDEX "kstudio_refresh_tokens_token_key" ON "kstudio_refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "kstudio_password_resets_token_key" ON "kstudio_password_resets"("token");
