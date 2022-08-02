const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {Posts, User, Likes}=require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const sequelize = require("sequelize");
const {Op} = require("sequelize");
const { INTEGER } = require("sequelize");


// 게시글 작성
router.post("/", authMiddleware, async (req,res)=>{
    const { userId } = res.locals.user;
    const {title, content}=req.body;

    const user = await User.findOne({
        where : {userId}
    });
    
    if (!user){
        return res.status(400).json({success : false, errorMessage : "유저를 입력해주세요."});
    }else if(!title){
        return res.status(400).json({success : false, errorMessage : "타이틀을 입력해주세요."});
    }else if(!content){
        return res.status(400).json({success : false, errorMessage : "내용을 입력해주세요."});
    }
    await Posts.create({userId, nickname:user.nickname, title, content});
    res.status(201).json({message : "게시글을 생성하였습니다."});
});



// 전체 게시글 조회
router.get("/", async (req,res)=>{
    Posts.hasMany(Likes, { foreignKey: "postId" });
    Likes.belongsTo(Posts, { foreignKey:"postId"});
    const posts=await Posts.findAll({
        include : [{model : Likes,}]
    });

    if(!posts.length){ 
        return res.json({success:false, errorMessage : "게시글이 없습니다."});
    }
    const cntLikesPosts = await posts.map((post)=>({
        postId:post.postId,
        userId:post.userId,
        nickname:post.nickname,
        title : post.title,
        content : post.content,
        createdAt:post.createdAt,
        updatedAt:post.updatedAt,
        likesCount:post.Likes.length
    }));

    return res.send({
        data :cntLikesPosts.sort((a,b)=>{return b.likesCount-a.likesCount})
    });
});


// 좋아요 조회
router.get("/like", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;

    Posts.hasMany(Likes, { foreignKey: "postId" });
    Likes.belongsTo(Posts, { foreignKey:"postId"});

    const likesCheckPost = await Likes.findAll({
        where:{userId}
    });
    const arr=likesCheckPost.map((table)=>(table.postId));
    const userLikedPost = await Posts.findAll({
        where: {
            [Op.or]:[{postId: arr}],
        },
        include : [{model : Likes,}]
    });


    return res.send({
        data: userLikedPost.map((table) => ({
            postId:table.postId,
            userId:table.userId,
            nickname:table.nickname,
            title : table.title,
            content : table.content,
            createdAt:table.createdAt,
            updatedAt:table.updatedAt,
            likesCount:table.Likes.length
        })).sort((a,b)=>{return b.likesCount-a.likesCount}),
    });

});


// 게시글 상세 조회
router.get("/:_postId", async (req, res)=>{
    const postId = req.params._postId;

    Posts.hasMany(Likes, { foreignKey: "postId" });
    Likes.belongsTo(Posts, { foreignKey:"postId"});



    const posts=await Posts.findOne({
        where : {postId},
        include : [{model : Likes}]
    });
    if (!posts){
        return res.json({success:false, errorMessage:"게시글이 없습니다."});
    }

    const cntLikesPost={
        postId:posts.postId,
        userId:posts.userId,
        nickname:posts.nickname,
        title : posts.title,
        content : posts.content,
        createdAt:posts.createdAt,
        updatedAt:posts.updatedAt,
        likesCount:posts.Likes.length
    };

    return res.json({data : cntLikesPost});
});




// 게시글 수정
router.put("/:_postId", authMiddleware, async (req, res)=>{
    const { userId } = res.locals.user;
    const postId= req.params._postId;
    const {password, title, content} = req.body;
    const postAuth = await Posts.findOne({where:{postId}});
    const userAuth =await User.findOne({where:{userId}});

    if(postAuth.userId !== userId){
        return res.status(400).json({success:false, errorMessage:"글을 작성한 유저가 아닙니다."})
    }else if(!password){
        return res.status(400).json({success:false, errorMessage:"비밀번호를 입력해주세요."});
    }else if(!title){
        return res.status(400).json({success:false, errorMessage:"제목을 입력해주세요."});
    }else if(!content){
        return res.status(400).json({success:false, errorMessage:"내용을 입력해주세요."});
    }else if(password!==userAuth.password){
        return res.status(400).json({success:false, errorMessage:"비밀번호가 일치하지 않습니다."})
    }else{
        const existsPost = await Posts.findOne({
            where : {userId, postId}
        });
        existsPost.title=title;
        existsPost.content=content;
        existsPost.save();
        return res.status(200).json({success:true, Message : "수정이 완료되었습니다."})
    }  
});



// 게시글 삭제
router.delete("/:_postId",authMiddleware, async (req, res)=>{
    const { userId } = res.locals.user;
    const postId=req.params._postId;
    const {password}=req.body;

    const postAuth = await Posts.findOne({where:{postId}});
    const userAuth =await User.findOne({where:{userId}});
    if(userId !== postAuth.userId){
        return res.send({message : "글을 작성한 유저가 아닙니다."});
    }else if(userAuth.password!==password){
        return res.status(400).json({success:false, message : "비밀번호가 일치하지 않습니다."});
    }
    else {
        const existsPost = await Posts.findOne({
            where:{postId,userId}
        });
        await existsPost.destroy();
        return res.status(200).json({message : "게시글을 삭제하였습니다."});
    }
});




// 좋아요 수정
router.put("/:_postId/like", authMiddleware, async (req, res)=>{
    const { userId } = res.locals.user;
    const postId= req.params._postId;
    const existsLikes = await Likes.findOne({
        where : {userId, postId},
    });

    if(existsLikes){
        existsLikes.destroy();
        return res.status(200).send({"message":"게시글의 좋아요를 취소하였습니다."});
    }else{
        await Likes.create({userId,postId});
        return res.status(200).send({"message":"게시글의 좋아요를 등록하였습니다."});
    }
});





module.exports = router;



