package project.BackEnd.TableAccessQueue;

import java.util.*;

public class TableAccessQueue {
    List<TableAccessData> queue;

    public static void main(String[] args) {

    }

    public void log() {
        for (TableAccessData t : queue) {
            System.out.println(t);
        }
        System.out.println();
        System.out.println();
    }

    public void clear() {
        this.queue = new ArrayList<>();
    }

    public TableAccessQueue() {
        this.queue = new ArrayList<>();
    }

    public int getPosition(TableAccessData table) {
        int position = 0;

        for (TableAccessData t : this.queue) {
            if (t.getTableID().equals(table.getTableID()) && t.getUserName().equals(table.getUserName())) {
                position = t.getPosition();
            }
        }
        return position;
    }

    public boolean addAndCheckIfCanBeAccessed(TableAccessData table) {
        int position = 0;

        for (TableAccessData t : this.queue) {
            if (t.getTableID().equals(table.getTableID())) {
                position++;
            }
        }
        table.setPosition(position);
        this.queue.add(table);
        return position == 0;
    }

    public boolean popPosition(TableAccessData table) {
        int position = 0;
        Iterator<TableAccessData> iterator = this.queue.iterator();

        while (iterator.hasNext()) {
            TableAccessData t = iterator.next();
            if (t.getTableID().equals(table.getTableID()) && t.getUserName().equals(table.getUserName())) {
                position = t.getPosition();
                iterator.remove();
            }
        }

        for (TableAccessData t : this.queue) {
            if (t.getTableID().equals(table.getTableID()) && t.getPosition() > position) {
                t.setPosition(t.getPosition() - 1);
            }
        }

        return true;
    }




}
