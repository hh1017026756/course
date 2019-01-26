package njurestaurant.njutakeout.blservice;

import njurestaurant.njutakeout.exception.NotExistException;
import njurestaurant.njutakeout.response.InfoResponse;
import njurestaurant.njutakeout.response.course.CourseListResponse;

public interface CourseBlService {

    /**
     * 添加课程（admin）
     * @param title 标题
     * @param text 内容
     * @param image 图片
     * @return 成功与否
     */
    InfoResponse addCourse(String title, String text, String image);

    /**
     * 获取某一篇课程时间戳前的10篇文章
     * 文章列表按照新旧排序，最新的在最前面，最旧的在最后面，如果有时间戳完全相同的，则不管10篇的限制，全部加入列表中
     * @param openid 用户的微信openid
     * @param id 课程文章ID
     * @return 课程文章信息列表
     */
    CourseListResponse getMyCourseListBefore(String openid, String id) throws NotExistException;
}
