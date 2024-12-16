import {ComponentProps, FC} from "react";
import {Card} from "@mui/material";

type AuthPropsType = ComponentProps<"div">

const Auth: FC<AuthPropsType> = ({}) => {
     return (
         <div>
              <Card variant="outlined">

              </Card>

         </div>
     )
}

export default Auth;