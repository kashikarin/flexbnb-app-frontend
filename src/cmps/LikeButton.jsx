import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { FaHeart } from "react-icons/fa"
import { removeUserLike, loadHome, addUserLike } from "../store/actions/home.actions"
import { addLike, removeLike } from "../store/actions/user.actions"

export function LikeButton({ homeId, father = '' }) {
  const loggedInUser = useSelector(state => state.userModule.loggedInUser)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!loggedInUser) return;
    setIsLiked(loggedInUser?.likedHomes?.includes(homeId) ?? false)
  }, [loggedInUser?.likedHomes, homeId])

  async function handleToggleLike(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!homeId || !loggedInUser) return;

    const nextLiked = !isLiked;
    setIsLiked(nextLiked)

    try {
      if (nextLiked) {
        await addLike(homeId, loggedInUser._id)
        await addUserLike(homeId, loggedInUser._id)
      } else {
        await removeLike(homeId, loggedInUser._id)
        await removeUserLike(homeId, loggedInUser._id)
      }
      await loadHome(homeId);
    } catch (err) {
      console.error("Cannot toggle like:", err)
    }
  }

  return (
    <div className='home-details-heart' onClick={handleToggleLike}>
      <FaHeart className={`home-details-heart-icon ${isLiked ? "saved" : ""}`} />
      {father === 'HomeDetails' && <span>{isLiked ? 'Saved' : 'Save'}</span>}
    </div>
  )
}