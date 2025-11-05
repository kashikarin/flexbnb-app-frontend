import { useIsMobile } from "../Providers/MobileProvider"
import { ProfileDesktop } from "../cmps/ProfileDesktop"
import { ProfileMobile } from "../cmps/ProfileMobile"

export function Profile(){
    const isMobile = useIsMobile()
    console.log("🚀 ~ isMobile:", isMobile)

    return(
        <div>
            {
                isMobile ? <ProfileMobile /> :
                           <ProfileDesktop />
            }
        </div>
    )
}