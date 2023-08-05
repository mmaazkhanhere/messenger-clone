import React from 'react'
import { BiHomeCircle, BiUser } from 'react-icons/bi'
import { HiOutlineHashtag } from 'react-icons/hi'
import { BsBell, BsBookmark, BsEnvelope, BsThreeDots, BsTwitter } from "react-icons/bs"
import Link from 'next/link'
import LeftSideBar from './components/LeftSideBar'


type Props = {}

const NAVIGATION_ITEMS = [
  {
    title: 'Twitter',
    icon: BsTwitter
  },
  {
    title: 'Home',
    icon: BiHomeCircle
  },
  {
    title: 'Explore',
    icon: HiOutlineHashtag
  },
  {
    title: 'Notifications',
    icon: BsBell
  },
  {
    title: 'Messages',
    icon: BsEnvelope
  },
  {
    title: 'Bookmarks',
    icon: BsBookmark
  },
  {
    title: 'Profile',
    icon: BiUser
  }
]

const Home = (props: Props) => {
  return (
    <div className='w-full h-full flex justify-center items-center relative'>
      <div className='max-w-screen-xl w-full h-full flex relative'>
        <LeftSideBar />
      </div>
    </div>
  )
}

export default Home