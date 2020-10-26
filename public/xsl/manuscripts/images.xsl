<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="text"/>

  <xsl:template match="tei:TEI">
    <xsl:value-of select="tei:facsimile/tei:graphic/@url"/>
  </xsl:template>

</xsl:stylesheet>