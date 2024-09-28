-- CreateTable
CREATE TABLE "kstudio_fav_items" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "url" TEXT,
    "coverImage" TEXT,
    "source" TEXT,
    "contentHash" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "sharePassword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kstudio_fav_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kstudio_fav_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kstudio_fav_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kstudio_fav_item_tags" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "kstudio_fav_item_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kstudio_fav_items_shareToken_key" ON "kstudio_fav_items"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "kstudio_fav_tags_name_key" ON "kstudio_fav_tags"("name");
