package njurestaurant.njutakeout.bl;

import njurestaurant.njutakeout.blservice.CourseBlService;
import njurestaurant.njutakeout.dataservice.CourseDataService;
import njurestaurant.njutakeout.entity.course.Course;
import njurestaurant.njutakeout.exception.NotExistException;
import njurestaurant.njutakeout.response.InfoResponse;
import njurestaurant.njutakeout.response.course.CourseItem;
import njurestaurant.njutakeout.response.course.CourseListResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseBlServiceImpl implements CourseBlService {

    private final CourseDataService courseDataService;

    @Autowired
    public CourseBlServiceImpl(CourseDataService courseDataService) {
        this.courseDataService = courseDataService;
    }

    @Override
    public InfoResponse addCourse(String title, String text, String image) {
        courseDataService.addCourse(new Course(title, text, image, System.currentTimeMillis()));
        return new InfoResponse();
    }

    @Override
    public CourseListResponse getMyCourseListBefore(String openid, String id) throws NotExistException {
        List<Course> courses = courseDataService.getMyCourseListBefore(openid, id);
        List<CourseItem> courseItems = new ArrayList<>();
        for(Course course:courses){
            courseItems.add(new CourseItem(course));
        }
        return new CourseListResponse(courseItems);
    }
}
