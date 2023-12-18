package project.BackEnd.TableConnections;

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
    TableInfo one;

    @ManyToOne
    @JoinColumn(name = "many")
    TableInfo many;

}
