import {ComponentProps, FC, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {useNavigate} from "react-router-dom";

type HomePropsType = ComponentProps<"div">

const Home: FC<HomePropsType> = ({}) => {
    const {token} = useAppSelector(state => state.user)
    const navigate = useNavigate();

    useEffect(() => {
        if(token === "") {
            navigate("/auth")
        }
    }, [])

    return (
        <div>

        </div>
    )
}

export default Home