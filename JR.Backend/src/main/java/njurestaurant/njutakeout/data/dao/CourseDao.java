package njurestaurant.njutakeout.data.dao;


import njurestaurant.njutakeout.entity.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseDao extends JpaRepository<Course, String> {
	List<Course> findCoursesByTimeStamp(long timeStamp);
	List<Course> findTop10ByOrderByTimeStampDesc();
	List<Course> findTop10ByTimeStampBeforeOrderByTimeStampDesc(long timeStamp);
}
