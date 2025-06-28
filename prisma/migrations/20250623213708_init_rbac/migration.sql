-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "company_id" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;
