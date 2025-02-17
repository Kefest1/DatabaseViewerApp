/**
 * This class creates a payload for a queue.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
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
