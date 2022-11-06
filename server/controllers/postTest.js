const multer = require("multer");
const app = require("../config/app");
const { transErrors, transSuccess } = require("../../lang/vi");
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const { validationResult } = require("express-validator/check");
const { post } = require("../services/index");
const fsExtra = require("fs-extra");
const storagePhoto = require("../utils/storagePhoto");
const storageFile = require("../utils/storageFile");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");

let newPost = async (req, res) => {
    let errorArr = [];
    let validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
        let errors = Object.values(validationErr.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg);
        });

        return res.status(500).send(errorArr);
    }
    try {
        const newPost = new PostModel.model(req.body);
        const savePost = await newPost.save();
        return res.status(200).json(savePost);
    } catch (error) {
        return res.status(500).send(error);
    }
};

let updatePost = async (req, res) => {
    let errorArr = [];
    let validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
        let errors = Object.values(validationErr.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg);
        });

        return res.status(500).send(errorArr);
    }
    try {
        const post = await PostModel.model.findById(req.params.id);

        if (post.userId === req.user._id) {
            await post.updateOne({ $set: req.body })
            return res.status(200).json("The post has been updated");
        } else {
            return res.status(403).json("You can update only your post");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

let deletePost = async (req, res) => {
    try {
        const post = await PostModel.model.findById(req.params.id);

        if (post.userId === req.user._id) {
            await post.deleteOne();
            return res.status(200).json("The post has been deleted");
        } else {
            return res.status(403).json("You can delete only your post");
        }


    } catch (error) {
        return res.status(500).send(error);
    }
};

let likePost = async (req, res) => {
    try {
        const post = await PostModel.model.findById(req.params.id);

        if (!post.likes.includes(req.user._id)) {
            await post.updateOne({ $push: { likes: req.user._id, } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.user._id, } });
            res.status(200).json("The post has been disliked");
        }

    } catch (error) {
        return res.status(500).send(error);
    }
};

let getPost = async (req, res) => {
    try {
        const post = await PostModel.model.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        return res.status(500).send(error);
    }
};

let getTimeline = async (req, res) => {
    try {
        const currentUser = await UserModel.findById(req.user._id);
        const userPosts = await PostModel.model.find({ userId: currentUser._id });

        const friendPosts = await Promise.all(
            currentUser.followings.map((friend) => {
                return PostModel.model.find({ userId: friend.userId });
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    newPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimeline,
};
