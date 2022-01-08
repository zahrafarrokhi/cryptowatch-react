import React from 'react'
import { motion } from 'framer-motion'
import './modal.css'

const Background = (props) => {
  const {onClick, children} = props
  return (
    <motion.div className="fixed z-30 w-screen h-screen top-0 left-0 flex align-middle justify-center mdlbg overflow-hidden"
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    >
      {children}
    </motion.div>
  )

}

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      type: "spring",
      damping: 25,
      stiffness: 500,
    }
  },
  exit: {
    y: "100vh",
    opacity: 0
  },
}

export default function Modal(props) {
  const {close, children, mdlstyles} = props;
  return (
    <Background onClick={close}>
    <motion.div
      onClick={e => e.stopPropagation()}
      className={`container z-40 rounded-xl p-2 bg-blue-500 m-auto w-1/3 h-1/4 ${mdlstyles}`}
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="-left-3 fixed -top-2 h-6 w-6 container rounded-full bg-blue-300 justify-center align-middle flex" onClick={e => {
        e.stopPropagation()
        close()
      }}>X</div>
      {children}
    </motion.div>
    </Background>
  )
}
