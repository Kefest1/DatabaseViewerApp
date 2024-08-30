package project.BackEnd.TableConnections;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.BackEnd.Table.TableInfo;

@Entity
@Table(name = "table_connection")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TableConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "one")
    @JsonIgnore
    TableInfo one;

    @ManyToOne
    @JoinColumn(name = "many")
    @JsonIgnore
    TableInfo many;

//    @Column(name = "one_column_name", length = 255, nullable = false)
//    String oneColumnName;
//
//    @Column(name = "many_column_name", length = 255, nullable = false)
//    String manyColumnName;

}
