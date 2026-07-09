import { motion } from "framer-motion";
import { Film } from "lucide-react";


function AuthLayout({children}) {


    return (

        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-zinc-950
            px-6
        ">


            <motion.div

                initial={{
                    opacity:0,
                    y:20
                }}

                animate={{
                    opacity:1,
                    y:0
                }}

                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-8
                    shadow-2xl
                "

            >


                <div className="
                    flex
                    flex-col
                    items-center
                    mb-8
                ">


                    <div className="
                        rounded-2xl
                        bg-red-600
                        p-4
                        mb-4
                    ">


                        <Film size={35}/>


                    </div>



                    <h1 className="
                        text-3xl
                        font-bold
                    ">

                        Video Club

                    </h1>


                    <p className="
                        text-zinc-400
                        mt-2
                        text-sm
                    ">

                        Sistema de administración

                    </p>



                </div>



                {children}


            </motion.div>


        </div>

    )

}


export default AuthLayout;