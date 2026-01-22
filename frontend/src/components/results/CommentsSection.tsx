import { useState } from "react";
import { FaComment } from "react-icons/fa";
import Avatar from "../../components/Avatar";
import { ICommentRes } from "../../types/result.types";
import { Link } from "react-router-dom";

interface CommentsSectionProps {
  comments: ICommentRes[];
  questionId: string;
  onAddComment: (questionId: string, text: string) => Promise<void>;
}

export const CommentsSection = ({
  comments,
  questionId,
  onAddComment,
}: CommentsSectionProps) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    await onAddComment(questionId, commentText);
    setCommentText("");
  };

  return (
    <div className="border-t border-gray-100 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaComment className="text-gray-500" />
          Comments ({comments?.length || 0})
        </h4>
      </div>
      <AddCommentForm
        value={commentText}
        onChange={setCommentText}
        onSubmit={handleSubmit}
      />

      <CommentsList comments={comments || []} />
    </div>
  );
};

interface CommentsListProps {
  comments: ICommentRes[];
}

const CommentsList = ({ comments }: CommentsListProps) => {
  if (comments.length === 0) {
    return <EmptyComments />;
  }

  return (
    <div className="space-y-5 mb-8">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

interface CommentItemProps {
  comment: ICommentRes;
}

const CommentItem = ({ comment }: CommentItemProps) => (
  <div className="flex gap-4 mt-10">
    <Link to={`/user/${comment.user_id}`} className="shrink-0">
      <Avatar
        user={
          {
            id: comment.user_id,
            username: comment.username,
            avatar: comment.avatar || "",
            email: "",
            banner: "",
            attempts: [],
            communities: [],
          } as any
        }
        size="md"
      />
    </Link>
    <div className="flex-1 bg-gray-50 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-bold text-gray-800">{comment.username}</span>
          <span className="text-xs text-gray-500 ml-2">
            •{" "}
            {new Date(comment.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{comment.comment_text}</p>
    </div>
  </div>
);

const EmptyComments = () => (
  <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
    <FaComment className="text-3xl mx-auto mb-3 text-gray-300" />
    <p className="text-lg font-medium">No comments yet</p>
    <p className="text-sm">Be the first to share your thoughts!</p>
  </div>
);

interface AddCommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const AddCommentForm = ({ value, onChange, onSubmit }: AddCommentFormProps) => (
  <div className="bg-linear-to-r from-gray-50 to-blue-50/30 p-5 rounded-xl border border-gray-200">
    <div className="flex gap-4">
      <div className="flex-1">
        <textarea
          placeholder="Add a comment about this question..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 transition-all"
          rows={3}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">
            Share your thoughts or ask a question
          </span>
          <button
            onClick={onSubmit}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  </div>
);
