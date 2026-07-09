import { motion } from "framer-motion";

function QuickAction({

    title,

    description,

    icon: Icon,

    onClick

}) {


    return (

        <motion.button


            whileHover={{
                scale:1.03
            }}


            whileTap={{
                scale:.97
            }}


            onClick={onClick}


            className="
                flex
                items-center
                gap-4

                rounded-2xl

                border
                border-zinc-800

                bg-zinc-900

                p-5

                text-left

                transition

                hover:border-red-500

            "

        >


            <div
                className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-xl

                bg-red-600
                "
            >

                <Icon size={22}/>

            </div>



            <div>


                <h3 className="font-semibold">

                    {title}

                </h3>



                <p className="text-sm text-zinc-400">

                    {description}

                </p>


            </div>


        </motion.button>

    );

}


export default QuickAction;