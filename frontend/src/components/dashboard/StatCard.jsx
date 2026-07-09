import { motion } from "framer-motion";

function StatCard({
    title,
    value,
    icon: Icon,
    description,
    color = "red"
}) {

    const colors = {

        red:
        "from-red-600/20 to-red-900/10 border-red-500/20",

        blue:
        "from-blue-600/20 to-blue-900/10 border-blue-500/20",

        green:
        "from-green-600/20 to-green-900/10 border-green-500/20",

        purple:
        "from-purple-600/20 to-purple-900/10 border-purple-500/20"

    };


    return (

        <motion.div

            initial={{
                opacity:0,
                y:20
            }}

            animate={{
                opacity:1,
                y:0
            }}

            whileHover={{
                y:-5
            }}

            transition={{
                duration:.25
            }}

            className={`
                rounded-2xl
                border
                bg-gradient-to-br
                ${colors[color]}

                p-6

                shadow-xl
            `}
        >

            <div className="flex items-center justify-between">


                <div>


                    <p className="text-sm text-zinc-400">

                        {title}

                    </p>


                    <h2 className="mt-2 text-4xl font-bold">

                        {value}

                    </h2>


                    <p className="mt-2 text-xs text-zinc-500">

                        {description}

                    </p>


                </div>



                <div
                    className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-zinc-950
                    "
                >

                    <Icon size={28}/>

                </div>


            </div>


        </motion.div>

    );

}


export default StatCard;