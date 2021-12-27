<script type="tea">
    import AppStyle from "svelte-doric/core/app-style"
    import baseline from "svelte-doric/core/baseline"
    import theme from "svelte-doric/core/theme/tron"

    import Button from "svelte-doric/core/button"
    import Card from "svelte-doric/core/card"
    import Icon from "svelte-doric/core/icon"
    import Radio from "svelte-doric/core/radio"
    import TitleBar from "svelte-doric/core/title-bar"

    import Flex from "svelte-doric/core/layout/flex"

    import Editor from "./comp/editor.svelte"

    ace.config.setModuleUrl(
        "ace/mode/tea"
        "tea_script.js"
    )
    ace.config.setModuleUrl(
        "ace/mode/teascript-hl-rules"
        "tea_script_highlight_rules.js"
    )

    fn debounce {
        @time
        @func

        mut next <+ null
        => fn {
            clearTimeout(next)
            next <+ setTimeout(
                fn => func()
                time
            )
        }
    }
    let targets <+ [
        {:label "browser", :value "browser"}
        {:label "es6", :value "es6"}
        {:label "node", :value "node"}
    ]

    let compiler <+ &Worker("compiler.js")

    mut sourceTea <+ ??(localStorage.tea : "")
    mut target <+ ??(localStorage.target : "browser")
    mut lastCompile <+ 0
    mut jsValid <+ false
    mut jsOutput <+ ""

    fn run {
        let runner <+ &Function(jsOutput)
        runner()
    }

    compiler.addEventListener(
        "message"
        fn {
            @evt +> {data}

            let data +> {time, valid, text}
            guard time < lastCompile {
                => void
            }

            lastCompile <+ time
            jsValid <+ valid
            jsOutput <+ text
        }
    )

    $: compilerOptions <+ {
        :target target
    }

    mut lastCode <+ null
    fn compile {
        guard lastCode == sourceTea {
            => void
        }
        jsValid <+ false
        jsOutput <+ "\"compiling...\""
        compiler.postMessage({
            :source sourceTea
            :options compilerOptions
        })
    }
    let compileCode <+ debounce(500, compile)

    $: compileCode(sourceTea)
    $: compile(compilerOptions)

    $: localStorage.tea <+ sourceTea
    $: localStorage.target <+ target
</script>

<style>
    repl-layout {
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: 175px 1fr 1fr;
        grid-template-rows: min-content auto;
    }

    header-area {
        display: grid;
        grid-column: span 3;
    }

    a, a:visited, a:hover {
        color: var(--primary);
    }
</style>

<AppStyle {baseline} {theme} />

<repl-layout>
    <header-area>
        <TitleBar>
            TeaScript REPL
        </TitleBar>
    </header-area>

    <Flex direction="column">
        <Card>
            <Flex>
                <a
                href="https://github.com/axel669/teascript/tree/live/ref"
                target="_blank"
                >
                    TeaScript Ref
                </a>
            </Flex>
        </Card>
        <Card>
            <svelte:fragment slot="title">
                Target
            </svelte:fragment>
            <Radio bind:value={target} options={targets} />
        </Card>

        {#if jsValid === true && target === "browser"}
            <Button variant="outline" color="secondary" on:tap={run}>
                <Icon name="play_arrow" /> Run
            </Button>
        {/if}
    </Flex>
    <Editor mode="ace/mode/tea" bind:code={sourceTea} />
    <Editor mode="ace/mode/javascript" code={jsOutput} readonly />
</repl-layout>
