import express from 'express'
const router = express.Router()
import Course from '../models/Course'
import Video from '../models/Video'

router.get('/', async (req, res) => {
  const courseId = req.query.courseid
  const course = await Course.findOne({ courseId: courseId })

  if (!course) {
    res.status(404).send('CourseId not found')
    return false
  }

  console.log(JSON.stringify(course))

  const videos = course.videoIds.map(x => Video.find({ videoId: x }))

  await Promise.all(videos)

  const videoDetails = videos.map(x => ({
    title: x.title ? x.title : 'Example video',
    lecturer: x.instructor ? x.instructor : 'Instructor',
    time: x.lengthSeconds ? x.lengthSeconds : '10mins',
  }))

  const data = {
    courseOverview: [{ paragraph: course.description }],
    courseVideos: videoDetails,
  }

  res.render('course', data)
})

export default router
