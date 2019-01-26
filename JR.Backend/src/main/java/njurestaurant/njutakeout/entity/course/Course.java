package njurestaurant.njutakeout.entity.course;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Table
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class Course {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;

    @Column
    private String title;//标题

    @Column
    private String text;//内容

    @Column
    private String image;//图片地址

    @Column
    private long timeStamp; //最近一次更新的时间戳

    public Course() {
    }

    public Course(String title, String text, String image, long timeStamp) {
        this.title = title;
        this.text = text;
        this.image = image;
        this.timeStamp = timeStamp;
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

    public String getDate() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        return simpleDateFormat.format(new Date(timeStamp));
    }
}
