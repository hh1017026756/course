package njurestaurant.njutakeout.springcontroller.course;

import io.swagger.annotations.*;
import njurestaurant.njutakeout.blservice.CourseBlService;
import njurestaurant.njutakeout.exception.NotExistException;
import njurestaurant.njutakeout.response.Response;
import njurestaurant.njutakeout.response.WrongResponse;
import njurestaurant.njutakeout.response.event.EventLoadResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CourseController {
    private final CourseBlService courseBlService;

    @Autowired
    public CourseController(CourseBlService courseBlService) {
        this.courseBlService = courseBlService;
    }

    @ApiOperation(value = "添加课程", notes = "添加课程")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "title", value = "课程标题", required = true, dataType = "String"),
            @ApiImplicitParam(name = "text", value = "课程内容", required = true, dataType = "String"),
            @ApiImplicitParam(name = "image", value = "image", required = true, dataType = "String"),
    })
    @RequestMapping(value = "/addCourse", method = RequestMethod.GET)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success", response = EventLoadResponse.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = WrongResponse.class),
            @ApiResponse(code = 500, message = "Failure", response = WrongResponse.class)})
    @ResponseBody
    public ResponseEntity<Response> addCourse(@RequestParam(name="title")String title, @RequestParam(name="text")String text,  @RequestParam(name="image")String image) {
        ResponseEntity<Response> r=new ResponseEntity<>(courseBlService.addCourse(title,text,image), HttpStatus.OK);
        return r;
    }

    @ApiOperation(value = "获取某一篇课程时间戳前的10篇", notes = "获取某一篇课程时间戳前的10篇")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openid", value = "微信用户openid", required = true, dataType = "String"),
            @ApiImplicitParam(name = "id", value = "课程id", required = true, dataType = "String")
    })
    @RequestMapping(value = "/getMyCourseListBefore", method = RequestMethod.GET)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success", response = EventLoadResponse.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = WrongResponse.class),
            @ApiResponse(code = 500, message = "Failure", response = WrongResponse.class)})
    @ResponseBody
    public ResponseEntity<Response> getMyCourseListBefore(@RequestParam(name="openid")String openid,@RequestParam(name="id")String id) throws NotExistException {
        return new ResponseEntity<>(courseBlService.getMyCourseListBefore(openid,id), HttpStatus.OK);
    }

}
