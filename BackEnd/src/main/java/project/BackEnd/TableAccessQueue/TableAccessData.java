package project.BackEnd.TableAccessQueue;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class TableAccessData {
    Long tableID;
    String UserName;

    int position;
}
