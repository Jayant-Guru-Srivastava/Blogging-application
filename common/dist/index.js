"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentOnBlogBody = exports.updateBlogInput = exports.createBlogInput = exports.updatePasswordInput = exports.updateUserInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    full_name: zod_1.default.string().optional(),
    bio: zod_1.default.string().optional(),
    avatar_url: zod_1.default.string().optional()
});
exports.signinInput = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
exports.updateUserInput = zod_1.default.object({
    username: zod_1.default.string().email(),
    full_name: zod_1.default.string().optional(),
    bio: zod_1.default.string().optional(),
    avatar_url: zod_1.default.string().optional()
});
exports.updatePasswordInput = zod_1.default.object({
    password: zod_1.default.string().min(6)
});
exports.createBlogInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    tagName: zod_1.default.array(zod_1.default.string()).optional(),
    categoryName: zod_1.default.array(zod_1.default.string()).optional()
});
exports.updateBlogInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    tagName: zod_1.default.array(zod_1.default.string()).optional(),
    categoryName: zod_1.default.array(zod_1.default.string()).optional()
});
exports.commentOnBlogBody = zod_1.default.object({
    comment: zod_1.default.string()
});
