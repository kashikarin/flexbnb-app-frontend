import { ReactSVG } from "react-svg"
import { LikeButton } from "./LikeButton"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

export function HomeDetailsMobileHeader(){
    const navigate = useNavigate()
    const home = useSelector(state =>state.homeModule.home)

    return(
        <div className="home-details-header-mobile">
            <div className="home-details-header-mobile-wrapper">
                <button onClick={()=> navigate('/')}>
                    <ReactSVG src='/svgs/arrow-back-header.svg' />
                </button>
                <LikeButton homeId={home?._id}/>
            </div>                
        </div>
    )
}

