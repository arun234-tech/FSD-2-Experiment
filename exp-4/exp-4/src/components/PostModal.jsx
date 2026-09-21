import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import {
    addPost,
    deletePost,
    updatePost,
} from "../store/postsSlice";

function PostModal({
    post,
    onClose,
}) {
    const dispatch = useDispatch();

    const isEditing =
        Boolean(post);

    const [form, setForm] =
        useState({
            id:
                post?.id ||
                `post-${Date.now()}`,

            title:
                post?.title || "",

            platform:
                post?.platform ||
                "LinkedIn",

            date:
                post?.date ||
                new Date()
                    .toISOString()
                    .slice(0, 10),

            time:
                post?.time ||
                "10:00",
        });

    useEffect(() => {
        if (post) {
            setForm(post);
        }
    }, [post]);

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        if (isEditing) {
            dispatch(
                updatePost(form)
            );
        } else {
            dispatch(
                addPost(form)
            );
        }

        onClose();
    };

    const handleDelete = () => {
        if (!isEditing) {
            return;
        }

        dispatch(
            deletePost(post.id)
        );

        onClose();
    };

    return (
        <div
            className="modal-overlay"
            onMouseDown={onClose}
        >
            <div
                className="modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="modal-header">

                    <div>

                        <span className="modal-eyebrow">
                            Scheduled Post
                        </span>

                        <h2>
                            {isEditing
                                ? "Edit Post"
                                : "Schedule Post"}
                        </h2>

                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="title">
                            Post Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={
                                handleChange
                            }
                            placeholder="Enter post title"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="platform">
                            Platform
                        </label>

                        <select
                            id="platform"
                            name="platform"
                            value={form.platform}
                            onChange={
                                handleChange
                            }
                        >
                            <option>
                                LinkedIn
                            </option>

                            <option>
                                Twitter
                            </option>

                            <option>
                                Instagram
                            </option>

                            <option>
                                Facebook
                            </option>

                        </select>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label htmlFor="date">
                                Date
                            </label>

                            <input
                                id="date"
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="time">
                                Time
                            </label>

                            <input
                                id="time"
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                    </div>

                    <div className="modal-actions">

                        {isEditing && (
                            <button
                                type="button"
                                className="danger-btn"
                                onClick={
                                    handleDelete
                                }
                            >
                                Delete
                            </button>
                        )}

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            {isEditing
                                ? "Save Changes"
                                : "Schedule Post"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default PostModal;