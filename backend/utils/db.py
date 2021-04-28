####
# credit from my COMP4920 project
####
import sqlite3	
from app import app	

def rowToDict(row):
    return dict(zip(row.keys(), row))

class Stub():	
    def __init__(self, conn, type, q):	
        self.conn = conn	
        self.type = type	
        self.q = q	
        self.q_values = tuple()	

    def values(self, **kargs):	
        keys = kargs.keys()	
        values = [kargs[k] for k in keys]	
        ph = ",".join(["?" for k in keys])	
        self.q += "({}) VALUES ({})".format(','.join(keys), ph)	
        self.q_values += tuple(values)	
        return self	

    def where(self, **kargs):	
        search_param = ["{} = ?".format(x) for x in kargs.keys()]	
        if (len(search_param) > 0):	
            self.q += " WHERE {}".format(" AND ".join(search_param))	
        self.q_values += tuple(kargs.values())	
        return self	

    def orwhere(self, **kargs):	
        search_param = ["{} = ?".format(x) for x in kargs.keys()]	
        if (len(search_param) > 0):	
            self.q += " WHERE {}".format(" OR ".join(search_param))	
        self.q_values += tuple(kargs.values())	
        return self	

    def set(self, **kargs):	
        set_param = ",".join(["{} = ?".format(x) for x in kargs])	
        self.q += " SET {}".format(set_param)	
        self.q_values += tuple(kargs.values())	
        return self	

    def execute(self):	
        c = self.conn.cursor()
        c.execute(self.q, self.q_values)
        
        if self.type == 'UPDATE' or self.type == 'DELETE':
            return c.rowcount
        elif self.type == 'INSERT':
            return c.lastrowid
        elif self.type == 'SELECT':
            rows = c.fetchall()
            if len(rows) == 0:
                return None
            return [rowToDict(row) for row in rows]
        elif self.type == 'SELECT_ONE':
            row = c.fetchone()
            if not row:
                return None
            return rowToDict(row)
        else:
            raise Exception("Unknown type for query {}".format(self.type))


class DB:	
    def __init__(self):	
        self.conn_url = app.config['DB_FILE']	
        self.conn = sqlite3.connect(self.conn_url)	
        self.conn.cursor().execute("PRAGMA foreign_keys = 1")	
        self.conn.row_factory = sqlite3.Row	


    def raw(self, q, params=[]):	
        self.conn.cursor().execute(q, tuple(params))	
        r = self.conn.cursor().fetchall()	
        self.conn.commit()	
        self.conn.close()	
        return r	

    def insert(self, table):	
        s = Stub(self.conn, 'INSERT', 'INSERT INTO {}'.format(table))	
        return s	

    def select(self, table):	
        s = Stub(self.conn, 'SELECT', 'SELECT {} FROM {}'.format("*", table))	
        return s	

    def select_one(self, table):	
        s = Stub(self.conn, 'SELECT_ONE', 'SELECT {} FROM {}'.format("*", table))
        return s	
    def update(self, table):	
        s = Stub(self.conn, 'UPDATE', 'UPDATE {}'.format(table))	
        return s	

    def delete(self, table):	
        s = Stub(self.conn, 'DELETE', 'DELETE FROM {}'.format(table))	
        return s	

    def commit(self):	
        self.conn.commit()	
        self.conn.close()
