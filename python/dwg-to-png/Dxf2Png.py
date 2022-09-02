from lib2to3.pytree import convert
import matplotlib.pyplot as plt
import ezdxf
from ezdxf.addons.drawing import RenderContext, Frontend
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
#import wx
import glob
import re

class Dxf2Png(object):
    default_img_res = 300
    ezdxf.addons.drawing.properties.MODEL_SPACE_BG_COLOR = "#FFFFFF"        #overiding bg color

    def convert(self, inputFile, outputFile, img_res=default_img_res):
        doc = ezdxf.readfile(inputFile)
        msp = doc.modelspace()
        # Recommended: audit & repair DXF document before rendering
        auditor = doc.audit()
        # The auditor.errors attribute stores severe errors,
        # which *may* raise exceptions when rendering.
        if len(auditor.errors) != 0:
            raise Exception("The DXF document is damaged and can't be converted!")
        else :
            fig = plt.figure()
            ax = fig.add_axes([0, 0, 1, 1])
            ctx = RenderContext(doc, )
            ctx.set_current_layout(msp)
            out = MatplotlibBackend(ax)
            Frontend(ctx, out).draw_layout(msp, finalize=True)
            fig.savefig(outputFile, dpi=img_res)

    def convertSvg(self, inputFile, outputFile):
        doc = ezdxf.readfile(inputFile)
        fig = plt.figure()
        out = MatplotlibBackend(fig.add_axes([0, 0, 1, 1]))
        Frontend(RenderContext(doc), out).draw_layout(doc.modelspace(), finalize=True)
        fig.savefig(outputFile)