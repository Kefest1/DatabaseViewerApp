/**
 * This class creates a table that holds connections between tables.
 *
 * @author Szymon Bigoszewski
 * @version 1.0
 */
package project.BackEnd.TableConnections;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import project.BackEnd.Table.TableInfo;

@Entity
@Table(name = "table_connection")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class TableConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "one")
    TableInfo one;

    @ManyToOne
    @JoinColumn(name = "many")
    TableInfo many;

    @Column(name = "one_column_name", length = 255, nullable = false)
    String oneColumnName;

    @Column(name = "many_column_name", length = 255, nullable = false)
    String manyColumnName;

    public TableConnection(TableInfo one, TableInfo many, String oneColumnName, String manyColumnName) {
        this.one = one;
        this.many = many;
        this.oneColumnName = oneColumnName;
        this.manyColumnName = manyColumnName;
    }
}
