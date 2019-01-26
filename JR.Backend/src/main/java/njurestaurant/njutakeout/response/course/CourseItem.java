package njurestaurant.njutakeout.response.course;


import njurestaurant.njutakeout.entity.course.Course;

public class CourseItem {
	private String id;
	private String title;//标题
	private String text;//内容
	private String image;//图片地址
	private long timeStamp; //最近一次更新的时间戳

	public CourseItem(Course course) {
		this.id = course.getId();
		this.title = course.getTitle();
		this.text = course.getText();
		this.image = course.getImage();
		this.timeStamp = course.getTimeStamp();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public long getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(long timeStamp) {
		this.timeStamp = timeStamp;
	}
}
