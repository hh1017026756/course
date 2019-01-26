package njurestaurant.njutakeout.data;

import njurestaurant.njutakeout.data.dao.CourseDao;
import njurestaurant.njutakeout.dataservice.CourseDataService;
import njurestaurant.njutakeout.entity.course.Course;
import njurestaurant.njutakeout.exception.NotExistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseDataServiceImpl implements CourseDataService {
    private final CourseDao courseDao;

    @Autowired
    public CourseDataServiceImpl(CourseDao courseDao) {
        this.courseDao = courseDao;
    }

    @Override
    public void addCourse(Course course) {
        courseDao.save(course);
    }

    @Override
    public Course getCourseById(String id) throws NotExistException {
        Optional<Course> optionalCourse = courseDao.findById(id);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            return course ;
        } else {
            throw new NotExistException("Course ID", id);
        }
    }

    @Override
    public List<Course> getMyCourseListBefore(String openid, String id) throws NotExistException {
        return getMyCourseListBeforeTimeStamp(openid,
                id.equals("")?-1:getCourseById(id).getTimeStamp());
    }

    @Override
    public List<Course> getMyCourseListBeforeTimeStamp(String openid, long timeStamp) throws NotExistException {
        List<Course> courses;
        if (timeStamp<0) {
            courses = courseDao.findTop10ByOrderByTimeStampDesc();
        } else {
            courses = courseDao.findTop10ByTimeStampBeforeOrderByTimeStampDesc(timeStamp);
        }

        if (!courses.isEmpty()) {
            List<Course> sameStampCourses = courseDao.findCoursesByTimeStamp(courses.get(courses.size()-1).getTimeStamp());
            for(Course ssc:sameStampCourses) {
                boolean flag = false; //标记ssc是否在courses中
                for(Course c:courses){
                    if(ssc.getId().equals(c.getId())){
                        flag = true;
                        break;
                    }
                }
                if(!flag){ //ssc不在courses里面，加入进去
                    courses.add(ssc);
                }
            }
        }
        return courses;
    }
}
