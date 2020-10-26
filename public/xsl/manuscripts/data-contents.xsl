<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:template match="tei:TEI">
    <html>
      <body>

        <h3 class="title is-4">Contents</h3>

        <div class="content">
        
          <xsl:apply-templates select="tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:msContents"/>

        </div>

      </body>
    </html>
  </xsl:template>

  <xsl:template match="tei:msContents">
    <div class="msContents">
      <p>
        <xsl:apply-templates select="tei:summary"/>
      </p>

      <ol>
        <xsl:apply-templates select="tei:msItem"/>
      </ol>
    </div>
  </xsl:template>

  <xsl:template match="tei:msItem">
    <li>
      <a>
        <xsl:attribute name="data-toggle">
          <xsl:value-of select="./@xml:id"/>
        </xsl:attribute>
        <strong><xsl:value-of select="tei:title"/></strong>
        <xsl:if test="tei:title=''">
          <xsl:text>[no title]</xsl:text>
        </xsl:if>
        <small>
          <span class="icon is-small"><i class="fas fa-chevron-left"></i></span>
          <span class="icon is-small is-hidden"><i class="fas fa-chevron-down"></i></span>
        </small>
      </a>
      <p class="is-hidden">
        <xsl:attribute name="data-for">
          <xsl:value-of select="./@xml:id"/>
        </xsl:attribute>
        <xsl:if test="tei:title/@ref">
          ID:
          <a>
            <xsl:attribute name="href">
              /works/<xsl:value-of select="tei:title/@ref"/>
            </xsl:attribute>
            <xsl:value-of select="tei:title/@ref"/>
          </a>
          <br/>
        </xsl:if>
        <span>ff. <xsl:value-of select="tei:locus/@from"/>-<xsl:value-of select="tei:locus/@to"/></span>
      </p>

      <p class="is-hidden">
        <xsl:attribute name="data-for">
          <xsl:value-of select="./@xml:id"/>
        </xsl:attribute>
        <xsl:apply-templates select="tei:incipit|tei:explicit"/>
      </p>

      <xsl:if test="tei:msItem">
        <ol class="is-hidden">
          <xsl:attribute name="data-for">
            <xsl:value-of select="./@xml:id"/>
          </xsl:attribute>
          <xsl:apply-templates select="tei:msItem"/>
        </ol>
      </xsl:if>
    </li>
  </xsl:template>

  <xsl:template match="tei:incipit">
    Inc.: <small><xsl:apply-templates/></small>
  </xsl:template>

  <xsl:template match="tei:explicit">
    Exp.: <small><xsl:apply-templates/></small>
  </xsl:template>

  <xsl:template match="tei:gap[@reason='ellipsis' ]">
    <xsl:text disable-output-escaping="yes"><![CDATA[&hellip;]]></xsl:text>
  </xsl:template>

  <xsl:template match="tei:supplied[@reason='omitted' ]">
    <xsl:text disable-output-escaping="yes"><![CDATA[&lsaquo;]]></xsl:text><xsl:value-of select="."/><xsl:text disable-output-escaping="yes"><![CDATA[&rsaquo;]]></xsl:text>
  </xsl:template>

  <xsl:template match="tei:supplied[@reason='lost' ]">
    <xsl:text disable-output-escaping="yes"><![CDATA[&#91;]]></xsl:text><xsl:value-of select="."/><xsl:text disable-output-escaping="yes"><![CDATA[&#93;]]></xsl:text>
  </xsl:template>

</xsl:stylesheet>