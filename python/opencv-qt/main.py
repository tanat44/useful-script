from PyQt5.QtWidgets import QApplication
from ui import Ui
import sys

if __name__=="__main__":
    app = QApplication(sys.argv)
    a = Ui()
    a.show()
    sys.exit(app.exec_())