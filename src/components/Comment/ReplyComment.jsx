import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const ReplyComment = ({
    setReplyActive,
    replyActive,
    userID,
    commentId,
    idPost
}) => {

    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);

    const [replyComment, setReplyComment] = useState('');
    //we need userId, reply, date and idComment

    const replyCommentFunc = async () => {
        try {

            const res = await axios.post(`${link}/posts/save-reply-comment/${idPost}`, {
                userID,
                commentId,
                reply: replyComment,
                dateReply: new Date()
            })
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }

        setReplyActive(!replyActive);
    }

    const cancelReply = () => {
        setReplyActive(!replyActive);
        setReplyComment('');
    }

    return (
        <div className={` ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} w-full flex mx-auto items-center justify-center shadow-lg mb-4 rounded-lg`}>
            <div className="w-full rounded-lg px-4 pt-2" >
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-full px-3 mb-2 mt-2">
                        <textarea
                            className=" rounded text-black leading-normal resize-none w-full h-20 py-2 px-3 font-medium  "
                            placeholder='Type Your Comment'
                            required
                            onChange={(e) => setReplyComment(e.target.value)}
                            value={replyComment}
                        ></textarea>
                    </div>
                    <div className="w-full md:w-full flex justify-end items-start px-3">
                        <div className="-mr-1">
                            <button
                                onClick={() => cancelReply()}
                                className="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-red-500 hover:bg-red-700"
                                placeholder='Type your Comment'
                            >Cancel</button>
                            <button
                                type='submit'
                                onClick={() => replyCommentFunc()}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                placeholder='Type your Comment'
                            >Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReplyComment