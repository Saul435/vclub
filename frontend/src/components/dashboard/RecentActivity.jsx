import { motion } from "framer-motion";
import { Activity } from "lucide-react";


function RecentActivity({ activities = [] }) {


    return (

        <div>


            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">

                <Activity size={22}/>

                Actividad reciente

            </h2>



            <div className="space-y-3">


                {
                    activities.map((item,index)=>(


                        <motion.div

                            key={index}


                            initial={{
                                opacity:0,
                                x:-15
                            }}


                            animate={{
                                opacity:1,
                                x:0
                            }}


                            transition={{
                                delay:index * .1
                            }}


                            className="
                                flex
                                items-center
                                justify-between

                                rounded-xl

                                border
                                border-zinc-800

                                bg-zinc-900

                                p-4

                            "

                        >


                            <div>


                                <p className="font-medium">

                                    {item.text}

                                </p>


                                <p className="text-sm text-zinc-500">

                                    {item.time}

                                </p>


                            </div>



                        </motion.div>


                    ))
                }


            </div>


        </div>

    );

}


export default RecentActivity;