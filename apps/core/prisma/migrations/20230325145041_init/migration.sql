-- CreateTable
CREATE TABLE "Configuration" (
    "id" SERIAL NOT NULL,
    "last_poll_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EtsyUser" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "first_line" TEXT NOT NULL,
    "second_line" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "EtsyUser_pkey" PRIMARY KEY ("id")
);
