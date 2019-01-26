package njurestaurant.njutakeout.dataservice;

import njurestaurant.njutakeout.entity.course.Course;
import njurestaurant.njutakeout.exception.NotExistException;

import java.util.List;

public interface CourseDataService {
    /**
     * 添加课程（admin）
     * @param course
     */
    void addCourse(Course course);

    /**
     * 通过id获取课程对象
     * @param id 课程id
     * @return
     * @throws NotExistException
     */
    Course getCourseById(String id) throws NotExistException;

    /**
     * 用户获取特定课程前的10篇课程，从新到旧排序（不包括这篇课程）
     * @param openid 用户微信openid
     * @param id 特定课程ID
     * @return 课程列表
     */
    List<Course> getMyCourseListBefore(String openid, String id) throws NotExistException;

    /**
     * 用户获取特定时间戳前的10篇课程，从新到旧排序（不包括这篇课程）
     * @param openid 用户微信openid
     * @param timeStamp 特定时间戳
     * @return 课程列表
     */
    List<Course> getMyCourseListBeforeTimeStamp(String openid, long timeStamp) throws NotExistException;
}
