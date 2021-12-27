<script type="tea">
    export mut mode <+ null
    export mut code <+ ""
    export mut readonly <+ false

    mut container <+ null
    mut editor <+ null

    fn init {
        guard container == null {
            => void
        }

        editor <+ ace.edit(container)
        editor.setTheme("ace/theme/tomorrow_night_bright")
        editor.setValue(code, -1)
        editor.setReadOnly(readonly)
        editor.setFontSize(14)
        editor.session.setMode(mode)
        editor.session.setUseWrapMode(true)
        editor.on(
            "change"
            fn {
                code <+ editor.getValue()
            }
        )
        => void
    }

    fn update {
        guard readonly == false || editor == null {
            => void
        }
        editor.setValue(code, -1)
        => void
    }

    $: init(container)
    $: update(code)
</script>

<style>
    editor-container {
        display: block;
    }
</style>

<editor-container bind:this={container} />
