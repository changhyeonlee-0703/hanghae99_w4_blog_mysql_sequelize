const express = require("express");
const {User, Comments} = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");


// 댓글 생성
router.post("/:_postId", authMiddleware, async (req, res)=>{
    const { userId } = res.locals.user;
    const postId = req.params._postId;
    const {content}=req.body;
    console.log('postId : ',postId);

    const user = await User.findOne({
        where:{userId}
    });

    if(!user){return res.status(400).json({success:false, errorMessage:"이름을 입력해주세요."});}
    else if(!content){return res.status(400).json({success:false, errorMessage:"내용을 입력해주세요."});}
    else {
        await Comments.create({userId, postId, content});
        return res.status(201).json({message : "댓글을 생성하였습니다."});
    }
});



// 댓글 목록 조회
router.get("/:_postId", async (req, res)=>{
    const postId=req.params._postId;

    const comments = await Comments.findAll({
        where:{postId}
    });
    res.json({
        data : comments.map((comment)=>({
            commentId : comment.commentId,
            userId : comment.userId,
            content : comment.content,
        }))
    });
});



// 댓글 수정
router.put("/:_commentId", authMiddleware, async (req, res)=>{
    const { userId } = res.locals.user;
    const commentId=req.params._commentId;
    const {content} = req.body;

    const existsComment = await Comments.findOne({
        where :{userId,commentId}
    });
    if(!existsComment){return res.status(400).json({success:false,errorMessage:"댓글을 단 유저와 계정이 다릅니다.."})}
    else if(!content){return res.status(400).json({success:false, errorMessage:"내용을 입력해주세요."});}
    else{
        existsComment.content=content;
        await existsComment.save();
        return res.json({message : "댓글을 수정하였습니다."});
    }   
});



// 댓글 삭제
router.delete("/:_commentId", authMiddleware, async (req, res)=>{
    const { userId } = res.locals.user;
    const commentId=req.params._commentId;

    const existsComment = await Comments.findOne({
        where:{userId,commentId}
    });
    if(!existsComment){return res.status(400).json({success : false, errorMessage : "댓글을 단 유저와 계정이 다릅니다."});}
    else{
        await existsComment.destroy();
        return res.json({success : true, message : "게시글을 삭제하였습니다."});
    }
});



module.exports = router;